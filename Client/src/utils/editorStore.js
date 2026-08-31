import { create } from "zustand";

const useEditorStore = create((set) => ({
  selectedLayer: "canvas",
  textOptions: null,
  canvasOptions: {
    height: 600,
    orientation: "portrait",
    size: "2:3",
    backgroundColor: "#efefef",
  },

  setSelectedLayer: (layer) => set({ selectedLayer: layer }),

  setTextOptions: (options) =>
    set((state) => ({
      textOptions: { ...state.textOptions, ...options },
    })),

  addText: () =>
    set({
      selectedLayer: "text",
      textOptions: {
        text: "Add text",
        fontSize: 32,
        color: "#000000",
        top: 50,
        left: 50,
      },
    }),

  setCanvasOptions: (options) =>
    set((state) => ({
      canvasOptions: { ...state.canvasOptions, ...options },
    })),

  resetStore: () =>
    set({
      selectedLayer: "canvas",
      textOptions: null,
      canvasOptions: {
        height: 600,
        orientation: "portrait",
        size: "2:3",
        backgroundColor: "#efefef",
      },
    }),
}));

export default useEditorStore;
