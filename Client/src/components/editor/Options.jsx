import { HexColorPicker } from 'react-colorful'
import useEditorStore from '../../utils/editorStore'

const portraitSizes = ['1:2', '9:16', '2:3', '3:4', '4:5', '1:1'];
const landscapeSizes = ['2:1', '16:9', '3:2', '4:3', '5:4', '1:1'];

const Options = () => {
    const selectedLayer = useEditorStore((s) => s.selectedLayer);
    const textOptions = useEditorStore((s) => s.textOptions);
    const setTextOptions = useEditorStore((s) => s.setTextOptions);
    const canvasOptions = useEditorStore((s) => s.canvasOptions);
    const setCanvasOptions = useEditorStore((s) => s.setCanvasOptions);

    if (selectedLayer === 'text' && textOptions) {
        return (
            <div className="options">
                <h2>Text Options</h2>
                <div className="optionGroup">
                    <label>Text</label>
                    <input
                        type="text"
                        value={textOptions.text}
                        onChange={(e) => setTextOptions({ text: e.target.value })}
                    />
                </div>
                <div className="optionGroup">
                    <label>Font Size</label>
                    <input
                        type="number"
                        value={textOptions.fontSize}
                        onChange={(e) => setTextOptions({ fontSize: Number(e.target.value) })}
                    />
                </div>
                <div className="optionGroup">
                    <label>Color</label>
                    <HexColorPicker
                        color={textOptions.color}
                        onChange={(color) => setTextOptions({ color })}
                    />
                </div>
            </div>
        )
    }

    const sizes = canvasOptions.orientation === 'portrait' ? portraitSizes : landscapeSizes;

    return (
        <div className="options">
            <h2>Canvas Options</h2>
            <div className="optionGroup">
                <label>Orientation</label>
                <div className="orientationButtons">
                    <button
                        className={canvasOptions.orientation === 'portrait' ? 'active' : ''}
                        onClick={() => setCanvasOptions({ orientation: 'portrait', size: '2:3' })}
                    >
                        Portrait
                    </button>
                    <button
                        className={canvasOptions.orientation === 'landscape' ? 'active' : ''}
                        onClick={() => setCanvasOptions({ orientation: 'landscape', size: '3:2' })}
                    >
                        Landscape
                    </button>
                </div>
            </div>
            <div className="optionGroup">
                <label>Aspect Ratio</label>
                <div className="sizePresets">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            className={canvasOptions.size === size ? 'active' : ''}
                            onClick={() => setCanvasOptions({ size })}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
            <div className="optionGroup">
                <label>Background Color</label>
                <HexColorPicker
                    color={canvasOptions.backgroundColor}
                    onChange={(color) => setCanvasOptions({ backgroundColor: color })}
                />
            </div>
        </div>
    )
}

export default Options
