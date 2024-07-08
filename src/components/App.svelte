<script>
  import { Alert } from "flowbite-svelte";
  import { APP_STATUS, appStatus } from "../store.ts";
  import StepLoading from "./StepLoading.svelte";
  import StepUpload from "./StepUpload.svelte";
  import StepChat from "./StepChat.svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert>
    <span class="font-medium">Something happend!</span>
    Change a few things up and try submitting again.
  </Alert>
{:else if $appStatus === APP_STATUS.QUOTA}
  <Alert>
    <span class="font-medium">Quota reached!</span>
    You have reached the maximum number of questions for this session.
  </Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <p>Chat mode activate!</p>
  <StepChat />
{:else}
  <Alert>
    <span class="font-medium">Error!</span>
    This state is not handled.
  </Alert>
{/if}
