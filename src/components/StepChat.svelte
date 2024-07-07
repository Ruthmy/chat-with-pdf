<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStatusError } from "../store";
  const { id, url, pages } = $appStatusInfo;

  let answer = "";
  let loading = false;

  // This is just a mockup of the images that will be shown
  const numOfImagesToShow = Math.min(pages.length, 4);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1;
    return url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg");
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    loading = true;

    const question = event.target.question.value;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          question,
        }),
      });

      if (!res.ok) {
        loading = false;
        console.error("Failed to ask question");
        return;
      }
    } catch (error) {
      setAppStatusError();
    } finally {
      loading = false;
    }

    const { answer: apiAnswer } = await res.json();
    answer = apiAnswer;
    loading = false;
  };
</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img
      clas="rounded w-full h-auto aspect-[400/540]"
      src={image}
      alt="PDF page"
    />
  {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">Your question here...</Label>
  <Input id="question" required placeholder="What is this document about?"
  ></Input>
</form>

{#if loading}
  <div class="flex justify-center items-center flex-col gap-y-2">
    <Spinner class="w-8 h-8"></Spinner>
    <p>Waiting for answer...</p>
  </div>
{/if}

{#if answer}
  <div class="mt-8">
    <p class="text-lg font-bold">Answer:</p>
    <p>{answer}</p>
  </div>
{/if}
