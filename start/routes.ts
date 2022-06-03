/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { Njila_Yetu: 'Teste de integração checkout paypal com adonis js v5' }
})
Route.get('/index', async ({ view }) => {
  return view.render('welcome')
})
Route.post('/api/orders', 'PaypalsController.create_order')
Route.post('/api/orders/:orderID/capture', 'PaypalsController.captureOrder')