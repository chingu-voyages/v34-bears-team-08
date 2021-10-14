<script>
  export let comment
</script>

<div class="border-t border-gray-primary">
    <form
      class="flex justify-between pl-0 pr-5"
    >
      <input
        aria-label="Add a comment"
        autoComplete="off"
        class="text-sm text-gray-base w-full mr-3 py-5 px-4"
        type="text"
        name="add-comment"
        placeholder="Add a comment..."
        value={comment}
      />
      <button
        class={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
        type="button"
        disabled={comment.length < 1}
      >
        Post
      </button>
    </form>
</div>