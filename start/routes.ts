/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const OpenaisController = () => import('#controllers/openais_controller')
const QuotasController = () => import('#controllers/quotas_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/openai/chat', [OpenaisController, 'chat']).use(middleware.auth({ guards: ['api'] }))
