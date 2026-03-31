import fs from 'fs';
import path from 'path';

const COMMON_PATHS = ['src/lib/auth.ts', 'src/config/auth.ts', 'lib/auth.ts', 'config/auth.ts'];

export function findAuthFile(relativePath: string | undefined = undefined) {
   if (relativePath) {
      const filePath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(filePath)) {
         return filePath;
      }
   } else {
      for (const p of COMMON_PATHS) {
         const filePath = path.join(process.cwd(), p);
         if (fs.existsSync(filePath)) {
            return filePath;
         }
      }
   }

   return undefined;
}
