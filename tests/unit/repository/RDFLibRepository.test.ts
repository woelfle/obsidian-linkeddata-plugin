import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import RDFLibRepository from '../../../src/repository/RDFLibRepository';
import TurtleFile from '../../../src/repository/TurtleFile';

describe('RDFLibRepository.init', () => {
  let repo: RDFLibRepository
  beforeEach(async () => {
    repo = new RDFLibRepository();
  })

  describe('RDFLibRepository.init', () => {
    test('initializes correctly', () => {
      expect(repo.init()).toBe(true);
    });  
  });

  describe('RDFLibRepository.addOntology', () => {
    beforeEach(async() => {
      repo.init();
    })

    test('ignores null parameter', () => {
      repo.addOntology(null);
    })

    test('ignores empty file', () => {     
      const emptyFile = mockTurtleFile("");
      repo.addOntology(emptyFile);
    })

    test('ignores invalid files', () => {
      const invalidFile = mockTurtleFile("lalelu");
      repo.addOntology(invalidFile);
    })
  })
});

const mockTurtleFile = (content: string) => {
  const emptyFileMock = jest.fn().mockImplementation(() => {
    return {          
      name: () => "hello.owl",
      toString: () => Promise.resolve(content)
    }
  })
  return emptyFileMock() as TurtleFile;
};
