import {MutableRefObject} from "react";
import {Editor} from "@tinymce/tinymce-react";
import {Editor as TinyMCEEditor} from 'tinymce';

export type TinyMceInputProps = {
	initialValue: string;
	editorRef: MutableRefObject<TinyMCEEditor | null>;
};

export default function TinyMceInput({initialValue, editorRef}: TinyMceInputProps) {
	return <Editor
		initialValue={initialValue}
		tinymceScriptSrc="https://zavadil.eu/tinymce8/tinymce.min.js"
		licenseKey="gpl"
		init={{
			promotion: false,
			branding: false,
			plugins: 'advlist autolink lists link image',
			toolbar: 'undo redo | bold italic | bullist numlist',
		}}
		onInit={(evt, editor) => editorRef.current = editor}
	/>
}
