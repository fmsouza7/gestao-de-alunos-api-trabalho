import { api } from './api.helper.js'

export async function criarDisciplina(token, dadosDisciplina) {
    const resposta = await api()
      .post('/api/admin/disciplinas')
      .set('Content-Type', 'application/json')
      .set('Authorization', await token)
      .send(dadosDisciplina);

    return resposta;

}

export async function matricularAlunoDisciplina(token, idDisciplina, idAluno) {
    const resposta = await api()
      .post(`/api/admin/disciplinas/${idDisciplina}/matriculas`)
      .set('Content-Type', 'application/json')
      .set('Authorization', await token)
      .send({ 
          alunoId: `${idAluno}`
      });

    return resposta;

}

export default { criarDisciplina, matricularAlunoDisciplina };