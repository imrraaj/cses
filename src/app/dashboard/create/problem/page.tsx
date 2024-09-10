import ProblemForm from "@/app/dashboard/ProblemForm";
import { saveOrEditProblem } from "@/app/dashboard/actions";

export default async function CreateProblemPage() {
    return (
        <div>
            <ProblemForm action={saveOrEditProblem}
                _title=""
                _description=""
                _timeLimit={0}
                _memoryLimit={0}
                _sampleInputs=""
                _sampleOutputs=""
                _explaination=""
            />
        </div>
    );
}