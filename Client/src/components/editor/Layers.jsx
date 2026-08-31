import useEditorStore from '../../utils/editorStore'

const Layers = () => {
    const selectedLayer = useEditorStore((s) => s.selectedLayer);
    const setSelectedLayer = useEditorStore((s) => s.setSelectedLayer);
    const addText = useEditorStore((s) => s.addText);
    const textOptions = useEditorStore((s) => s.textOptions);

    return (
        <div className="layers">
            <h2>Layers</h2>
            <div
                className={`layerItem ${selectedLayer === 'text' ? 'active' : ''}`}
                onClick={() => {
                    if (!textOptions) addText();
                    else setSelectedLayer('text');
                }}
            >
                Add Text
            </div>
            <div
                className={`layerItem ${selectedLayer === 'canvas' ? 'active' : ''}`}
                onClick={() => setSelectedLayer('canvas')}
            >
                Canvas
            </div>
        </div>
    )
}

export default Layers
