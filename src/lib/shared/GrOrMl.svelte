<script lang="ts">
  interface Props {
    value: string | number;
    unit: string | undefined;
  }

  const props: Props = $props();
  const unitToShow = props.unit ?? 'gr';
  const valueWithUnit = `${props.value}${unitToShow}`
</script>
<span>{valueWithUnit}</span>

