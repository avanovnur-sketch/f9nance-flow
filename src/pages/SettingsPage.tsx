import { useRef, useState } from 'react'
import { Camera, LogOut, Moon, Sun, Trash2, User } from 'lucide-react'
import { useTheme, type Theme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { cn } from '../utils/cn'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { inputClass } from '../components/ui/styles'

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'dark', label: 'Тёмная', icon: Moon },
]

const MAX_SIZE_MB = 5

/** Сжимает изображение до нужного размера через canvas */
function compressImage(file: File, maxSizeMB: number): Promise<File> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // Уменьшаем размеры если картинка очень большая
      const MAX_DIM = 1024
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width)
          width = MAX_DIM
        } else {
          width = Math.round((width * MAX_DIM) / height)
          height = MAX_DIM
        }
      }

      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)

      // Подбираем качество пока файл не влезет в лимит
      let quality = 0.9
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              quality -= 0.1
              tryCompress()
            }
          },
          'image/jpeg',
          quality,
        )
      }
      tryCompress()
    }
    img.src = url
  })
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  const [name, setName] = useState(user?.user_metadata?.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.user_metadata?.avatar_url ?? '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [notify, setNotify] = useState({ budget80: true, budgetOver: true, weekly: false })
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      toast('Можно загружать только изображения', 'error')
      return
    }

    setUploadingAvatar(true)

    // Сжимаем если файл больше 1 МБ
    const processed = file.size > 1 * 1024 * 1024
      ? await compressImage(file, MAX_SIZE_MB)
      : file

    const ext = processed.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() ?? 'jpg')
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, processed, { upsert: true, contentType: processed.type })

    if (uploadError) {
      setUploadingAvatar(false)
      toast('Ошибка загрузки: ' + uploadError.message, 'error')
      return
    }

    // Получаем публичную ссылку
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + `?t=${Date.now()}` // cache-bust

    // Сохраняем в user_metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: url, full_name: name },
    })

    setUploadingAvatar(false)

    if (updateError) {
      toast('Ошибка сохранения: ' + updateError.message, 'error')
    } else {
      setAvatarUrl(url)
      toast('Фото обновлено')
    }

    // Сброс input чтобы можно было загрузить тот же файл повторно
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeAvatar = async () => {
    if (!user || !avatarUrl) return
    setUploadingAvatar(true)
    await supabase.auth.updateUser({ data: { avatar_url: '' } })
    setAvatarUrl('')
    setUploadingAvatar(false)
    toast('Фото удалено')
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, avatar_url: avatarUrl },
    })
    setSavingProfile(false)
    if (error) {
      toast('Ошибка при сохранении: ' + error.message, 'error')
    } else {
      toast('Профиль сохранён')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="animate-fade-up text-2xl font-bold">Настройки</h1>

      {/* Профиль */}
      <Card className="animate-fade-up delay-100">
        <CardHeader title="Профиль" />

        {/* Аватар */}
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <div className="relative">
            {/* Круг аватара */}
            <div className="relative size-24 overflow-hidden rounded-2xl shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Аватар"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent-strong to-indigo-500 text-3xl font-bold text-white">
                  {initials !== '?' ? initials : <User className="size-10" />}
                </div>
              )}
              {/* Оверлей при загрузке */}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>

            {/* Кнопка камеры */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              aria-label="Загрузить фото"
              className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-xl bg-accent-strong text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
            >
              <Camera className="size-4" aria-hidden />
            </button>

            {/* Скрытый input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
              aria-label="Выбрать фото профиля"
            />
          </div>

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="font-semibold text-lg">{name || 'Без имени'}</p>
            <p className="text-sm text-muted">{user?.email}</p>
            <div className="flex gap-2 justify-center sm:justify-start">
              <Button
                variant="secondary"
                className="h-9 px-3 text-xs"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
              >
                <Camera className="size-3.5" /> Загрузить фото
              </Button>
              {avatarUrl && (
                <Button
                  variant="ghost"
                  className="h-9 px-3 text-xs text-expense hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  onClick={removeAvatar}
                  disabled={uploadingAvatar}
                >
                  <Trash2 className="size-3.5" /> Удалить
                </Button>
              )}
            </div>
            <p className="text-xs text-muted">JPG, PNG, WebP — сжимается автоматически</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <Field label="Имя" htmlFor="s-name">
            <input
              id="s-name"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Ваше имя"
            />
          </Field>
          <Field label="Электронная почта" htmlFor="s-email" hint="Изменить почту можно в Supabase">
            <input id="s-email" className={inputClass} value={user?.email ?? ''} disabled />
          </Field>
          <Field label="Основная валюта" htmlFor="s-cur">
            <select id="s-cur" className={inputClass} defaultValue="KGS">
              <option value="KGS">KGS — кыргызский сом</option>
              <option value="USD">USD — доллар США</option>
              <option value="RUB">RUB — российский рубль</option>
              <option value="EUR">EUR — евро</option>
            </select>
          </Field>
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? 'Сохраняем…' : 'Сохранить профиль'}
          </Button>
        </form>
      </Card>

      {/* Тема */}
      <Card className="animate-fade-up delay-150">
        <CardHeader title="Тема оформления" />
        <div role="radiogroup" aria-label="Тема оформления" className="grid grid-cols-2 gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex min-h-14 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition',
                theme === value
                  ? 'border-accent bg-accent-strong/20 text-accent-text shadow-sm'
                  : 'border-border text-muted hover:border-accent/40 hover:text-fg',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Уведомления */}
      <Card className="animate-fade-up delay-200">
        <CardHeader title="Уведомления" subtitle="Когда предупреждать о бюджете" />
        <div className="space-y-1">
          {(
            [
              ['budget80', 'Предупреждать при достижении 80% бюджета'],
              ['budgetOver', 'Предупреждать при превышении лимита'],
              ['weekly', 'Еженедельная сводка на почту'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm transition hover:bg-card-hover">
              <input
                type="checkbox"
                className="size-5 accent-violet-600"
                checked={notify[key]}
                onChange={(e) => setNotify((n) => ({ ...n, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
      </Card>

      {/* Безопасность */}
      <Card className="animate-fade-up delay-300">
        <CardHeader title="Безопасность" />
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Вошли как: <span className="font-medium text-fg">{user?.email}</span>
          </p>
          <Button variant="secondary" onClick={signOut} className="w-full sm:w-auto">
            <LogOut className="size-4" aria-hidden /> Выйти из аккаунта
          </Button>
        </div>
      </Card>
    </div>
  )
}
