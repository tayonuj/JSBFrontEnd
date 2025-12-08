// plugin.js
import { createVNode, render } from 'vue';
import ConfirmComponent from './ConfirmComponent.vue';

export default {
    install: (app) => {
        const confirmMethod = (options) => {
            return new Promise((resolve) => {
                const container = document.createElement('div');
                const vNode = createVNode(ConfirmComponent, { ...options, resolve });

                // Provide app context to the component
                vNode.appContext = app._context;

                render(vNode, container);
                document.body.appendChild(container);

                const cleanup = () => {
                    render(null, container); // Unmount the component
                    document.body.removeChild(container);
                };

                vNode.component.ctx.onCleanup = cleanup;
            });
        };

        app.config.globalProperties.$confirm = confirmMethod;
    }
};
