

// MATCHERS

// Para CHECAR se VALORES satisfazem alguma condição, usa-se a
// palavra-chave 'EXPECT',que é uma função, seguida de MATCHERS, que 
// são funções que verificam algo.

// ~ Como argumento, EXPECT recebe o VALOR PRODUZIDO PELO CÓDIGO
// ~ Como argumento, MATCHER's recebem o VALOR CORRETO ESPERADO


// 1) IGUALDADE EXATA => .ToBe

// test ('2 + 2 = 4', () => {
  // expect (2+2).toBe(4);
  // });
  
  // 2) IGUALDADE DE VALOR => .ToEqual
  // test ('atribuição de obj'() =>{
    // const data = {nome: 'Maria'};
    // expect(data).ToEqual({nome: 'Maria'});
    // });
    
    // 3) ARITMÉTICOS 
    // 4) STRINGS (EXPR REG)
    
    // test('mas existe "stop" em Christoph', () => {
      //   expect('Christoph').toMatch(/stop/);
      // });

      // 5) SE ARRAY CONTEM ITEM
      
      // const shoppingList = [
        //   'fraldas',
        //   'kleenex',
        //   'sacos de lixo',
        //   'papel toalha',
//   'leite',
// ];

// test('a lista de compras tem leite nela', () => {
  //   expect(shoppingList).toContain('leite');
  //   expect(new Set(shoppingList)).toContain('leite');
  // });
  
  // 5) SE FUNÇÃO LANÇA ERRO

  
  // importamos la funcion que vamos a testear
  // import { myFunction } from '../src/lib/index';
  
  // describe('myFunction', () => {
  //   it('debería ser una función', () => {
  //     expect(typeof myFunction).toBe('function');
  //   });
  // });