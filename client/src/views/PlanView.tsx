import { PageIntro } from "../components/ui/PageIntro";
import { Panel } from "../components/ui/Panel";
import { SourceNote } from "../components/ui/SourceNote";

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function PlanView() {
  return (
    <div className="grid gap-4 [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-1.5 [&_ol]:pl-5.5 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-1.5 [&_ul]:pl-5.5">
      <PageIntro title="What you're walking into.">
        The short version, then how to train for it without hating every minute.
      </PageIntro>

      <Panel title="The ISA, from LanguageLine's own material">
        <ul>
          <li>
            It's the final exam of LanguageLine Interpreter School, and every interpreter has to pass it.
          </li>
          <li>Six components, bidirectional: English into Spanish and Spanish into English.</li>
          <li>
            It scores healthcare terminology, accuracy and completeness (memory retention, note-taking,
            conversion), interpretation protocol, customer service, and language proficiency.
          </li>
          <li>The format is consecutive: a speaker finishes a chunk, then you render it.</li>
        </ul>
        <SourceNote>
          Sources:{" "}
          <ExternalLink href="https://470255.fs1.hubspotusercontent-na1.net/hubfs/470255/LLS-InterpreterQuality_Healthcare.pdf">
            LanguageLine Interpreter Quality (Healthcare)
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://www.languageline.com/interpreting/on-demand/interpreter-quality">
            LanguageLine interpreter quality page
          </ExternalLink>
          .
        </SourceNote>
      </Panel>

      <Panel title="What raters take points off for">
        <ul>
          <li>
            <b>Omission:</b> anything you dropped, including hedges and repetitions.
          </li>
          <li>
            <b>Addition:</b> anything you added, like reassurance or an explanation.
          </li>
          <li>
            <b>Distortion:</b> a number, negation, time, name or dose that changed.
          </li>
          <li>
            <b>Register shift:</b> softening a blunt line or dressing up a casual one.
          </li>
          <li>
            <b>Terminology:</b> a description in place of the proper term. This is why the app checks the
            exact glossary wording.
          </li>
          <li>
            <b>Protocol:</b> third-person rendering, side conversations, guessing instead of asking.
          </li>
        </ul>
        <p>
          LanguageLine's own court test uses a "scoring unit" method where 67% and below fails. The ISA cut
          score isn't published, so the app asks for 80% before opening the next rung.
        </p>
        <SourceNote>
          Sources:{" "}
          <ExternalLink href="https://pigment.is/blogs/blogs/interpreter-skills-assessment">
            Pigment, interpreter skills assessment overview
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://www.languageline.com/hubfs/Court_Certification_Test.pdf">
            LanguageLine Court Certification Test Q&amp;A
          </ExternalLink>
          .
        </SourceNote>
      </Panel>

      <Panel title="How this app is built for a brain that won't sit still">
        <ul>
          <li>
            <b>Sprints, not sessions.</b> 6 to 20 items, about three minutes. Short sessions spread over the
            day beat one long block for retention.
          </li>
          <li>
            <b>Recall, not rereading.</b> Every item makes you produce the answer before you see it. Retrieval
            with feedback is the best-supported study method there is.
          </li>
          <li>
            <b>Leitner boxes.</b> Misses come back sooner, known items fade out. "Redo my misses" is the
            fastest win on a bad day.
          </li>
          <li>
            <b>Interleaving.</b> The boss call mixes everything. It feels harder, and that difficulty is what
            makes it stick.
          </li>
          <li>
            <b>A clock.</b> The ring turns studying into a game with a deadline, and the real call doesn't
            wait either.
          </li>
        </ul>
        <SourceNote>
          Sources:{" "}
          <ExternalLink href="http://www.lscp.net/persons/ramus/docs/EPR20.pdf">
            meta-analysis on spaced retrieval practice
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://files.eric.ed.gov/fulltext/ED536925.pdf">
            Using Spacing to Enhance Diverse Forms of Learning
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://www.shimmer.care/blog/adhd-study-strategies">
            Shimmer, ADHD study strategies
          </ExternalLink>
          .
        </SourceNote>
      </Panel>

      <Panel title="The minimum viable day">
        <ol>
          <li>Open the app, hit the big button. One sprint. That's the whole commitment.</li>
          <li>If you're still going, run "Redo my misses".</li>
          <li>Later in the day, one more sprint on any rung. Spacing them out is the point.</li>
          <li>
            Once you pass rung 6, add shadowing off the app: play any Spanish medical video and repeat it a
            few words behind the speaker for two minutes.
          </li>
          <li>Two or three days before the test, run the boss call once a day and the protocol quiz once.</li>
        </ol>
        <p>Test-day setup: a quiet room, a wired headset, water, paper for numbers and negations.</p>
      </Panel>
    </div>
  );
}
