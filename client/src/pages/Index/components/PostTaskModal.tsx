import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/Input"
import Modal, { type ModalProps } from "../../../components/ui/Modal"
import Textarea from "../../../components/ui/Textarea"

type PostTaskModalProps = Omit<ModalProps, 'title'>
const PostTaskModal = ({description, ...props}: PostTaskModalProps) => {
    return <Modal title="new task" {...(!description ? {'aria-description': "Create a new task for your to-do-list"} : {description})} {...props}>
        <form className="space-y-5.5 capitalize" autoComplete="off" >
        <fieldset className="flex flex-col gap-y-2">
            <label htmlFor="title">Title<span className="ml-1 text-destructive" >*</span></label>
            <Input placeholder="Task title"  id="title" required />
        </fieldset>
        <fieldset className="flex flex-col gap-y-2">
          <label htmlFor="description">Description</label>
          <Textarea id="description" placeholder="Task description" />
        </fieldset>
        <div className="flex sm:flex-row flex-col gap-y-2 justify-between px-2">
          <Button base="secondary" >Cancel</Button>
          <Button>Create</Button>
        </div>
      </form>
    </Modal>
}
export default PostTaskModal;