import vine from '@vinejs/vine'

export const LoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().maxLength(254),
    password: vine.string().minLength(8).maxLength(100),
  })
)
