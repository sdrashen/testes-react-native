import { obtemLeiloes } from "../../src/repositorio/leilao";

import apiLeiloes from '../../src/servicos/apiLeiloes';

jest.mock('../../src/servicos/apiLeiloes'); //Aqui mockamos a api, logo foram mockadas também as funções.
// Dentro desse jest.mock são params. Pode-se passar como params uma arrow function 
// que retorna exatamene o que tem dentro de api leilões. Mas aqui ñ será
// feito dessa forma (apesar de ser mais fácil caso o objetivo seja mockar algo
//mais simples) porque cada api/método vai retornar dados diferentes.  
//Se for feito get em leilões será retornado uma lista de leilões, se for feito
//get em leilões/{id} será retornado um objeto de leilões.
//Aqui queremos fazer mocks diferentes para cada teste. Então definimos o que
//são os nossos leilões.
//Dentro do teste "Deve retornar uma lista de leilões" é possível constatar
//o porquê de ñ termos passado outro param no jest.mock

const mockLeiloes = [
    //Esse objeto será uma representação da lista de leilões que queremos retornar
    {
        id: 1,
        nome: 'Leilao',
        descricao: 'Descrição do leilão'
    }
]

//Aqui descrevemos/definimos como queremos que a função de requisição
//Essa function irá retornar qualquer coisa que queremos, o nome dela é opcional.
//Aqui a chamaremos de "retorno"

const mockRequisicao = (retorno) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: retorno //Esse data é uma propriedade do axios. Em leilões.js
                //quando feita uma requisição retorna "resposta.data"
                //Esse retorno é o mesmo que foi passado por params ali em cima.
            })
        }, 200) //200ms é o tempo que demora a requisição
    });
}

//Feito o mock de requisição é necessário fazer com que ele seja aplicado na api.
//Pra isso é necessário importar o api file. (import apiLeiloes from '../../src/servicos/apiLeiloes';)
//Feito a importação, é possível pegar as referências mockadas existentes (feitas pelo mock)
//e fazer um implementação diferente no 
//próprio teste em si ("Deve retornar uma lista de leilões").

const mockRequisicaoErro = () => {
    return new Promise((_, reject) => {
        //Aqui utilizamos o reject e o resolve pode ser substituído por _ porque
        //ele ñ será utilizado
        setTimeout(() => {
            reject()//Depois de 200ms apenas reject será retornado
        }, 200)
    });
}

describe("repositorio/lance", () => {

    beforeEach(() => {
        apiLeiloes.get.mockClear(); //mockClear() é uma outra function do mock.
    });//Essa function vai rodar sempre antes de cada teste executando
    //o que for determinado. Nesse caso, é determinado que o mock seja limpo
    //pra que ele resete a contagem de execuções.
    describe("obtemLeiloes", () => {
        it("Deve retornar uma lista de leilões", async () => {
            apiLeiloes.get.mockImplementation(() => mockRequisicao(mockLeiloes))
            //Após a importação da api:
            //Na linha acima mockamos de fato a function, definimos que o get de apiLeilões
            //será o mock que acabamos de criar (mockLeiloes)
            //Pegamos o obj que acabamos de importar (apiLeilões), 
            //.get (function que queremos mockar lá dentro) e
            //.mockImplementation (function que vem do jest), que mocka a implementação
            //do nosso método(ou seja, aqui queremos mockar a implementação do get)
            //"mockRequisicao(mockLeiloes)" é a descrição de como queremos que essa function seja
            //A requisição, assim, recebe o mockLeilões que criamos.
            //Caso queiramos mudar alguma coisa na requisição basta mudar ali o param.
            const leiloes = await obtemLeiloes();
            expect(leiloes).toEqual(mockLeiloes);//Nesse caso usamos o toEqual que é próprio para objetos
            
            //Abaixo, expects de validação que verificam as chamadas/se os métodos foram
            //chamados com tal params.
            expect(apiLeiloes.get).toHaveBeenCalledWith('/leiloes');
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        })
        it("Deve retornar uma lista vazia quando a requisição falhar", async () => {
            apiLeiloes.get.mockImplementation(() => mockRequisicaoErro());
            //Esse mockRequisicaoErro foi criado depois (copiado e colado e feitas algumas mundaças)
            //conforme a demanda do teste.
            //A mockRequisicaoErro ñ necessita param.
            const leiloes = await obtemLeiloes();
            expect(leiloes).toEqual([]);
            expect(apiLeiloes.get).toHaveBeenCalledWith('/leiloes');
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
            //Se for deixado 1, vai dar erro no teste porque esse na verdade o get foi chamado
            //duas vezes. A info da function toHaveBeenCalledTimes é global para todo o nosso teste,
            //no first teste realizado ele foi chamado uma vez e nesse teste aqui está sendo
            //chamado again, ou seja, foi chamado mais de uma vez.
            //Pode-se usar uma function do jest que "limpa" o nº de vezes que ele foi chamado,
            //deve ser colocada ali entre os dois describes. 
        })
    })
})