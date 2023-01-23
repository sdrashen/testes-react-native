import { formataMaiorLanceDoLeilao } from "../../../src/negocio/formatadores/lance";

describe ('negocio/formatadores/lance', () => {
    describe('formataMaiorLanceDoLeilao', () => {
        it('Deve retornar o maior lance do leilão', () => {
          const lances = [
            {
              valor: 10,
            },
            {
              valor: 20,
            },
            {
              valor: 30,
            },
          ];
          const valorInicial = 3;
          const maiorLance = formataMaiorLanceDoLeilao(lances, valorInicial);
          expect(maiorLance).toBe(30);
        });
    });

    it('Deve retornar o valor inicial se não existir lances', () => {
        const lances = [];
        const valorInicial = 3;
        const maiorLance = formataMaiorLanceDoLeilao(lances, valorInicial);
        expect(maiorLance).toBe(3);
    });
});