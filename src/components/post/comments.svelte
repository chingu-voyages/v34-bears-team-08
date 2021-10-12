<script>
import { login } from "$lib/stores/auth";
import AddComments from "./add-comments.svelte";

export let comments;

let commentsSlice = 3;
</script>

<div class="p-4 pt-1 pb-4">
    {comments.slice(0, commentsSlice).map((item) => (
      <p key={`${item.comment}-${item.displayName}`} class="mb-1">
        <a href={`/p/${item.displayName}`}>
          <span class="mr-1 font-bold">{item.displayName}</span>
        </a>
        <span>{item.comment}</span>
      </p>
    ))}
    {comments.length >= 3 && commentsSlice < comments.length && (
      <button
        class="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
        type="button"
        onClick={showNextComments}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
           console.log('You pressed Enter')
          }
        }}
      >
        View more comments
      </button>
    )}
    <p class="text-gray-base uppercase text-xs mt-2">
    </p>
  </div>
  <AddComments
    docId={docId}
    comments={comments}
  />