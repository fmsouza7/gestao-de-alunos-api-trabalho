import mongoose from 'mongoose';
import { expect } from 'chai';
import { seed } from '../../src/database/seed.js';
import { criarAluno } from '../helpers/aluno.helper.js';
import { entregarTrabalho  } from '../helpers/trabalho.helper.js';
import { criarDisciplina, matricularAlunoDisciplina } from '../helpers/disciplina.helper.js';
import { comTokenAdmin, comTokenFabio } from '../helpers/auth.helper.js'
import testesDeEntregaDeTrabalhos from '../fixtures/trabalho.fixture.json' with { type: 'json' };

describe('Fluxo de Entrega de Trabalho realizada pelo aluno', () => {
    after(async () => { 
    await mongoose.connection.close(); 
    });

    // Realiza um drop no banco e recria com os dados default contidos no seed
    before(async () => {
    await mongoose.connection.dropDatabase(); // limpa tudo
    await seed(); // recria dados default
    });

    //Prepara o testes para ser executado conforme dados no arquivo trabalho.fixture.json
    testesDeEntregaDeTrabalhos.forEach(testesDeEntregaDeTrabalho => {
        it.only(testesDeEntregaDeTrabalho.testTitle, async () => {
            //Cadastrar um aluno
            const cadastroAlunoResposta = await criarAluno(comTokenAdmin(), testesDeEntregaDeTrabalho.dadosAluno);
            const alunoId = cadastroAlunoResposta.body.id;

            //Cadastrar uma Disciplina
            const cadastroDisciplinaResposta = await criarDisciplina(comTokenAdmin(), testesDeEntregaDeTrabalho.dadosDisciplina);
            const disciplinaId = cadastroDisciplinaResposta.body.id;
            
            // //Matricular o novo Aluno na nova Disciplina
            const matricularResposta = await matricularAlunoDisciplina(comTokenAdmin(), disciplinaId, alunoId);
            
            //Realizar entrega do trabalho logado com o Aluno cadastrado
            const dadosTrabalhoAtualizado = { 
                ...testesDeEntregaDeTrabalho.dadosTrabalho,
                disciplinaId: disciplinaId
            };
            
            const entregarTrabalhoResposta = await entregarTrabalho(alunoId, await comTokenFabio(), dadosTrabalhoAtualizado)     
            expect(entregarTrabalhoResposta.status).to.equal(testesDeEntregaDeTrabalho.statusCodeEsperado);
            expect(entregarTrabalhoResposta.body.disciplinaId).to.equal(dadosTrabalhoAtualizado.disciplinaId);
            expect(entregarTrabalhoResposta.body.titulo).to.equal(dadosTrabalhoAtualizado.titulo);
            expect(entregarTrabalhoResposta.body.descricao).to.equal(dadosTrabalhoAtualizado.descricao);
            expect(entregarTrabalhoResposta.body.status).to.equal("entregue");

        });
    });
});