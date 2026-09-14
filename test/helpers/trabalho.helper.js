import { api } from './api.helper.js'

export async function entregarTrabalho(alunoId, token, dadosTrabalho) {
    const resposta = await api()
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Content-Type', 'application/json')
      .set('Authorization', await token)
      .send(dadosTrabalho);

    return resposta;

}

export default { entregarTrabalho };