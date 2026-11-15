import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema, type LoginValues } from '../schemas/auth'
import { supabase } from '../lib/supabase'
import { AuthLayout } from '../components/layout/AuthLayout'
import { PasswordInput } from '../components/forms/PasswordInput'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { inputClass } from '../components/ui/styles'

export default function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const onSubmit = async ({ email, password }: LoginValues) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('root', { message: 'Неверная почта или пароль' })
      return
    }
    navigate('/dashboard')
  }

  return (
    <AuthLayout title="Вход" subtitle="Войдите, чтобы увидеть свои финансы">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Электронная почта" htmlFor="l-email" error={errors.email?.message}>
          <input
            id="l-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'l-email-msg' : undefined}
            {...register('email')}
          />
        </Field>
        <Field label="Пароль" htmlFor="l-pass" error={errors.password?.message}>
          <PasswordInput
            id="l-pass"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'l-pass-msg' : undefined}
            {...register('password')}
          />
        </Field>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-accent-text hover:underline">
            Забыли пароль?
          </Link>
        </div>
        {errors.root && (
          <p role="alert" className="text-sm text-red-500">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Входим…' : 'Войти'}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-medium text-accent-text hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </AuthLayout>
  )
}
