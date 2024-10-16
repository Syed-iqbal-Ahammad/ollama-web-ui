import { toast, Toaster } from 'sonner';

const ToastSonner = ({ msg, type, msgtype }) => {
    if (msgtype === 'warning') {
        toast.warning(msg, {
            position: type,
        })
    } else if (msgtype === 'success') {
        toast.success(msg, {
            position: type,
        })
    } else if (msgtype === 'error') {
        toast.error(msg, {
            position: type,
        })
    } else {
        toast(msg, {
            position: type,
        })
    }
    return (
        <>
            <Toaster richColors />
        </>
    )
}

export default ToastSonner
