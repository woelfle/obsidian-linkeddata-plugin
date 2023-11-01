import {beforeEach, describe, expect, test} from '@jest/globals';
import RDFLibRepository from '../../../src/repository/RDFLibRepository';

describe('RDFLibRepository.init', () => {
  let repo: RDFLibRepository
  beforeEach(async () => {
    repo = new RDFLibRepository();
  })
  test('initializes correctly', () => {
    expect(repo.init()).toBe(true);
  });
});
