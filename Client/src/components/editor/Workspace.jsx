import { useRef, useState } from 'react'
import useEditorStore from '../../utils/editorStore'

const Workspace = ({ previewUrl }) => {
    const textOptions = useEditorStore((s) => s.textOptions);
    const setTextOptions = useEditorStore((s) => s.setTextOptions);
    const canvasOptions = useEditorStore((s) => s.canvasOptions);
    const canvasRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!dragging || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const left = ((e.clientX - rect.left) / rect.width) * 100;
        const top = ((e.clientY - rect.top) / rect.height) * 100;
        setTextOptions({
            left: Math.max(0, Math.min(100, left)),
            top: Math.max(0, Math.min(100, top)),
        });
    };

    const handleMouseUp = () => setDragging(false);

    const handleDeleteText = () => {
        useEditorStore.setState({ textOptions: null, selectedLayer: 'canvas' });
    };

    const aspectMap = {
        '1:2': 0.5, '9:16': 9 / 16, '2:3': 2 / 3,
        '3:4': 3 / 4, '4:5': 4 / 5, '1:1': 1,
    };

    const ratio = aspectMap[canvasOptions.size] || 2 / 3;
    const width = 340;
    const height = canvasOptions.orientation === 'portrait'
        ? width / ratio
        : width * ratio;

    return (
        <div
            className="workspace"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="workspaceCanvas"
                ref={canvasRef}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: canvasOptions.backgroundColor,
                }}
            >
                {previewUrl && (
                    <img src={previewUrl} alt="preview" />
                )}
                {textOptions && (
                    <div
                        className="workspaceText"
                        style={{
                            left: `${textOptions.left}%`,
                            top: `${textOptions.top}%`,
                            fontSize: `${textOptions.fontSize}px`,
                            color: textOptions.color,
                            transform: 'translate(-50%, -50%)',
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        {textOptions.text}
                        <button
                            className="workspaceTextDelete"
                            onClick={handleDeleteText}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Workspace
