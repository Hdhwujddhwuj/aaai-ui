<script setup lang="ts">
import {
    ElFormItem,
    ElInput,
    ElRow,
    ElCol,
} from 'element-plus';
import FormLabel from './FormLabel.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    label?: string;
    modelValue: any;
    prop: string;
    type?: string;
    resize?: "none" | "both" | "horizontal" | "vertical";
    placeholder?: string;
    autosize?: boolean | object;
    info?: string;
    labelStyle?: string;
    change?: Function;
}>();

const emit = defineEmits(["update:modelValue"]);

function onChanged(value: string) {
    emit("update:modelValue", value);
    if (props.change) props.change(value);
}
</script>

<template>
    <el-form-item :prop="prop">
        <template #label>
            <FormLabel :info="info" :label-style="labelStyle">
                <slot name="label">{{label}}</slot>
            </FormLabel>
        </template>
        <el-row style="width: 100%;">
            <el-col :span="21">
                <el-input
                    :model-value="modelValue"
                    :autosize="autosize"
                    :resize="resize"
                    @input="onChanged"
                    :type="type"
                    :placeholder="placeholder"
                ><template #append><slot name="append" /></template></el-input>
            </el-col>
            <el-col :span="3">
                <slot name="inline" />
            </el-col>
        </el-row>
    </el-form-item>
</template>