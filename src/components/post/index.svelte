<script>
    import Header from './Header.svelte';
    import Image from './Image.svelte';
    import Actions from './Actions.svelte';
    import Footer from './Footer.svelte';
    import Comments from './Comments.svelte';

    const  likes = [];
    const comments= [
          {
            displayName: 'dali',
            comment: 'Love this place, looks like my animal farm!'
          },
          {
            displayName: 'orwell',
            comment: 'Would you mind if I used this picture?'
          }
        ];

    let content = {
      username:'developer',
      imageSrc:'https://source.unsplash.com/1600x900/?memes,developer';
      caption:'Saint George and the Dragon',
      docId:'dsjdhsjkhdjshjkhadkjdsds',
      likes,
      userLikedPhoto:true,
      comments,
      dateCreated:Date.now()
    }
</script>


<div class="rounded col-span-4 border bg-white border-gray-primary mb-12">
    <Header username={content.username} />
    <Image src={content.imageSrc} caption={content.caption} />
    <Actions
      docId={content.docId}
      totalLikes={content.likes.length}
      likedPhoto={content.userLikedPhoto}
    />
    <Footer caption={content.caption} username={content.username} />
    <Comments
      docId={content.docId}
      comments={content.comments}
      posted={content.dateCreated}
    />
  </div>