// Test import to see if packages are accessible
import { useProjectStore } from '@omnicut/store';
import { VERSION } from '@omnicut/core';

console.log('Imports working!', VERSION);
console.log('Store:', useProjectStore);
