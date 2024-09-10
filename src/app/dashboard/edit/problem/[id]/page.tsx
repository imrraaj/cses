import ProblemForm from "@/app/dashboard/ProblemForm";
import { saveOrEditProblem } from "@/app/dashboard/actions";
import { db } from "@/db/db";
import { ProblemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function EditProblemPage({ params }: { params: { id: string } }) {
    const problems = await db.select().from(ProblemsTable).where(eq(ProblemsTable.id, parseInt(params.id)));
    const problem = problems[0];
    return (
        <div>
            <ProblemForm
                action={saveOrEditProblem}
                _id={problem.id}
                _title={problem.title}
                _description={problem.description}
                _timeLimit={parseInt(problem.timeLimit)}
                _memoryLimit={parseInt(problem.memoryLimit)}
                _sampleInputs={problem.sampleTestCaseInput}
                _sampleOutputs={problem.sampleTestCaseOutput}
                _explaination={problem.explaination}
            />
        </div>
    );
}