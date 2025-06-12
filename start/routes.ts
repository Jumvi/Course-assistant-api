/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const OpenaisController = () => import('#controllers/openais_controller')
const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const HistoriesController = () => import('#controllers/histories_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/openai/chat', [OpenaisController, 'chat']).use(middleware.auth({ guards: ['api'] }))
router.post('/singUp', [AuthController, 'singUp'])
router.post('/login', [AuthController, 'login'])
router
  .get('/user/chat/history', [HistoriesController, 'getUserChatHistory'])
  .use(middleware.auth({ guards: ['api'] }))
