const fs = require("fs");
const { Client } = require(process.cwd() + "/node_modules/pg");

const env = {};
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?\s*$/);
  if (m) env[m[1]] = m[2];
}
const url = env.DATABASE_URL_UNPOOLED || env.DATABASE_URL;
if (!url) throw new Error("no DATABASE_URL in .env");

const TRACKS = [
  ["trk-blue-hour","blue-hour","Blue Hour","Blues",24,"/audio/music-library/blue-hour-preview.mp3",1],
  ["trk-prime-time-84","prime-time-84","Prime Time '84","80s Disco",26,"/audio/music-library/prime-time-84-preview.mp3",2],
  ["trk-orbit-after-dark","orbit-after-dark","Orbit After Dark","Electronic / Space Disco",25,"/audio/music-library/orbit-after-dark-preview.mp3",3],
  ["trk-deep-pocket","deep-pocket","Deep Pocket","Funk",26,"/audio/music-library/deep-pocket-preview.mp3",4],
  ["trk-electric-therapy","electric-therapy","Electric Therapy","Rock",25,"/audio/music-library/electric-therapy-preview.mp3",5],
];

(async () => {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: true } });
  await client.connect();
  await client.query(`DELETE FROM "LibraryTrack" WHERE slug = ANY($1)`, [[
    "demo-midnight-motorway","demo-brass-tacks","demo-glass-harbour","demo-quiet-hours","demo-low-light-district",
  ]]);
  for (const [id, slug, title, genre, dur, audio, order] of TRACKS) {
    await client.query(
      `INSERT INTO "LibraryTrack"
         (id, slug, title, genre, moods, "useCases", "durationSec", "audioUrl", description,
          status, featured, "sortOrder", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,'{}','{}',$5,$6,NULL,'PUBLISHED'::"ContentStatus",false,$7,now(),now())
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, genre=EXCLUDED.genre, moods=EXCLUDED.moods,
         "useCases"=EXCLUDED."useCases", "durationSec"=EXCLUDED."durationSec",
         "audioUrl"=EXCLUDED."audioUrl", description=EXCLUDED.description,
         status=EXCLUDED.status, featured=EXCLUDED.featured,
         "sortOrder"=EXCLUDED."sortOrder", "updatedAt"=now()`,
      [id, slug, title, genre, dur, audio, order]
    );
  }
  const res = await client.query(`SELECT "sortOrder", title, status, "audioUrl" FROM "LibraryTrack" ORDER BY "sortOrder"`);
  for (const r of res.rows) console.log(`${r.sortOrder}. ${r.title} [${r.status}] ${r.audioUrl}`);
  await client.end();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
