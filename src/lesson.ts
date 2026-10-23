import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 42,
  title: "Sandbox and Host Boundaries",
  description: "Suppose a student gives an agent a path to a report on the application server. Does the remote sandbox now have that file? No.",
  concepts: ["Host files and cloud files differ", "Opaque file IDs and ownership", "Canonical checks do not solve every race"],
  scope: "Reads from a fixed in-memory published file manifest. It never opens model-selected workspace paths. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Read an owned published file", "input": {"fileId": "guide", "requestedPath": "reports/guide.txt"}, "expected": "passed", "checks": {"content": "Reviewed field guide"}}, {"id": "1", "label": "Reject traversal", "input": {"fileId": "guide", "requestedPath": "../.env"}, "expected": "rejected", "checks": {}}, {"id": "2", "label": "Reject a foreign file ID", "input": {"fileId": "private", "requestedPath": "reports/private.txt"}, "expected": "rejected", "checks": {}}],
  async run(input) {

const request=text(input,"requestedPath"),manifest:Record<string,{owner:string;path:string;text:string}>={guide:{owner:"demo-user",path:"reports/guide.txt",text:"Reviewed field guide"},private:{owner:"other-user",path:"reports/private.txt",text:"Private"}};
const file=manifest[text(input,"fileId")];
if(!safePath(request)||!file||file.owner!=="demo-user"||file.path!==request)return report("rejected","The host manifest did not authorize this file and path",{},["Resolve an opaque file identifier","Check ownership and exact published path"]);
return report("passed","Read authorized bytes from the immutable local manifest",{content:file.text,sha256:hash(file.text),cloudTransfer:false},["Use host-owned inventory","Avoid arbitrary model-selected file access","Do not equate this local check with cloud OS isolation"]);

  }
};
