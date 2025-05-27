import Button from "../../components/ui/Button";
import PostTaskModal from "./components/PostTaskModal";
import Task from "./components/Task";

const Index = () => {
    return  <main className="w-11/12 flex flex-col justify-center items-center gap-y-7">
          <Task title="saluuttt" description="une tache special" />
    <Button size="lg" className="font-curve" aria-expanded="false" aria-haspopup="dialog" aria-controls="modal">new task</Button>
    <PostTaskModal />
  </main>
}
export default Index;