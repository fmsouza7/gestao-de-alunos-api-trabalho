import { api } from './api.helper.js'
import 'dotenv/config'

let tokenEmCache = null

export async function comTokenAdmin() {
  if (!tokenEmCache) { 
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.ADMIN_EMAIL,
          senha: process.env.ADMIN_SENHA
        });

      tokenEmCache = loginResposta.body.token;
  }
  return `Bearer ${tokenEmCache}`;

}

export async function comTokenFabio() {
  if (!tokenEmCache) { 
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.FABIO_EMAIL,
          senha: process.env.FABIO_SENHA
        });

      tokenEmCache = loginResposta.body.token;
  }
  return `Bearer ${tokenEmCache}`;

}

export default { comTokenAdmin, comTokenFabio };