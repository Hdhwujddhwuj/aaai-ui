import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useOptionsStore } from "./options";
import { useOutputStore } from "./outputs";

export const useUIStore = defineStore("ui", () => {
    const multiSelect = ref(false);
    const selected = ref<number[]>([]);
    const progress  = ref(0);
    const waitMsg   = ref('');
    const activeIndex = ref('/');
    const activeCollapse = ref(["2"]);
    const activeModal = ref(-1);

    /**
     * Raises an error in the console and in the UI
     */
    function raiseError(err: string) {
        console.error(err);
        ElMessage({
            type: 'error',
            message: err,
        })
    }

    /**
     * Toggles multi select for images
     */
    function toggleMultiSelect() {
        if (multiSelect.value) {
            multiSelect.value = !multiSelect.value;
            selected.value = [];
            return;
        }
        multiSelect.value = !multiSelect.value;
    }

    /**
     * Toggles selected image
     */
    function toggleSelection(id: number) {
        if (selected.value.includes(id)) {
            const index = selected.value.indexOf(id);
            selected.value.splice(index, 1);
            return;
        }
        selected.value.push(id);
    }

    /**
     * Updates the wait time progress bar
     */
    function updateProgress(waitTime: number, secondsElapsed: number) {
        const percentage = 100 * (1 - waitTime / (waitTime + secondsElapsed));
        progress.value   = Math.round(percentage * 100) / 100;
        waitMsg.value    = `EST: ${Math.round(waitTime)}s`;
        console.log(`${progress.value.toFixed(2)}%`);
    }

    function openModalToRight() {
        const outputStore = useOutputStore();
        const optionStore = useOptionsStore();
        if (outputStore.currentOutputs.map(el => el.id).includes(outputStore.sortedOutputs[activeModal.value + 1].id)) {
            activeModal.value++;
            return;
        }
        if (outputStore.currentPage <= Math.floor(outputStore.outputs.length / optionStore.pageSize)) {
            outputStore.currentPage++;
            activeModal.value++;
            return;
        }
    }

    function openModalToLeft() {
        const outputStore = useOutputStore();
        if (outputStore.currentPage > 0 && !outputStore.currentOutputs.map(el => el.id).includes(outputStore.sortedOutputs[activeModal.value - 1].id)) {
            outputStore.currentPage--;
            activeModal.value--;
            return;
        }
        if (activeModal.value > 0) {
            activeModal.value--;
            return;
        }
    }

    return {
        // Variables
        multiSelect,
        selected,
        progress,
        waitMsg,
        activeIndex,
        activeCollapse,
        activeModal,
        // Actions
        raiseError,
        toggleMultiSelect,
        toggleSelection,
        updateProgress,
        openModalToRight,
        openModalToLeft
    };
});
