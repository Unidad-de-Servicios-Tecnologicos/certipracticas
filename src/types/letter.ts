import type { Intern } from './intern';
import type { TrainingCenter } from './center';
import type { Period } from './period';
import type { Activities } from './activities';
import type { Instructor } from './instructor';
import type { Signer } from './signer';
import type { Drafter } from './drafter';
import type { LetterMetadata } from './metadata';

export interface Letter {
  intern: Intern;
  center: TrainingCenter;
  period: Period;
  activities: Activities;
  instructor: Instructor;
  signer: Signer;
  drafter: Drafter;
  metadata: LetterMetadata;
}

export type {
  Intern,
  TrainingCenter,
  Period,
  Activities,
  Instructor,
  Signer,
  Drafter,
  LetterMetadata,
};
