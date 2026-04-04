// import {signIn} from '../auth.js';

// jest.mock ('../auth.js');
// jest.mock('../__mocks__/export.js');


// describe('signIn,', () => {
//     it('should be a function', () => {
//     expect(typeof signIn).toBe('function');
//     });
// });




const filterCharacter = (characters, name, isAlive) => {
    return characters.filter(char => char && char.name.includes(name) && isAlive(char));
  }

