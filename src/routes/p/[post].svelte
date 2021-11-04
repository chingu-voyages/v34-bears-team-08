<script>
import { page } from '$app/stores'
import { GetPhoto } from '$lib/gql/GetPhoto'

GetPhoto({ photoID: $page.params.post })
</script>
