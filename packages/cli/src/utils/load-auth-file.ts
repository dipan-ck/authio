import { createJiti } from 'jiti';
import { SwiftAuth } from 'swift-auth';

const jiti = createJiti(import.meta.url);

export async function loadAuthConfig(path: string) {
   const mod: any = await jiti.import(path);

   const auth = mod.default;

   if (!auth) {
      throw new Error('Invalid config: expected `export default { auth: ... }`');
   }

   if (!(auth instanceof SwiftAuth)) {
      throw Error('auth must be an Instance of SwiftAuth');
   }

   return auth;
}
