import { sql } from './_db.js';
import { withCors, readJson } from './_cors.js';
// ...handler from your message
export default withCors(handler);