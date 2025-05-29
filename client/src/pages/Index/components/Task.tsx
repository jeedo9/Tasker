import { BiCheck as Check, BiTrash as Trash} from "react-icons/bi";
import Button from "../../../components/ui/Button";
import cn from "../../../utils/helpers";

type TaskProps = {
    className?: string,
    title: string,
    description?: string
}
const Task = ({className, title, description}: TaskProps) => {
    return <div className={cn("flex animate-anim min-h-28.5 relative shadow-sm hover:shadow-md transition hover:bg-tertiary/85 duration-300 bg-tertiary rounded-md py-4 px-6 border-[.06em] border-border w-full sm:w-[inherit]", className)}>
        <div className="space-y-3"> 
          <h2 className="font-bold w-fit line-through hover:scale-102 transition-all duration-300 text-shadow-sm/15 dark:text-shadow-sm/33  max-w-[82%] sm:max-w-[91%] text-shadow-foreground normal-case">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="flex gap-x-2 text-xl absolute right-4 sm:right-5 [&>button]:rounded-xs [&>button]:hover:opacity-70 [&>button]:active:scale-92 [&>button]:transition">
          <Button noStyle><Check /></Button>
          <Button noStyle><Trash className="text-destructive" /></Button>
        </div>
    </div>
}
export default Task;