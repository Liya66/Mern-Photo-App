import './editor.css'
import Layers from './Layers'
import Workspace from './Workspace'
import Options from './Options'
import useEditorStore from '../../utils/editorStore'

const Editor = ({ previewUrl, onClose }) => {
    const resetStore = useEditorStore((s) => s.resetStore);

    const handleClose = () => {
        resetStore();
        onClose();
    };

    return (
        <div className="editor">
            <button className="editorClose" onClick={handleClose}>✕</button>
            <Layers />
            <Workspace previewUrl={previewUrl} />
            <Options />
            <button
                className="editorDone"
                style={{ position: 'absolute', bottom: 24, right: 280 }}
                onClick={onClose}
            >
                Done
            </button>
        </div>
    )
}

export default Editor
