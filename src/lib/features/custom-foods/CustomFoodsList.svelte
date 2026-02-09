<script lang="ts">
	import type { FoodItem } from '$lib/types/food';
	import FoodCard from '$lib/features/food/FoodCard.svelte';
	import { foodStore } from '$lib/stores/foods.svelte';

	let {
		onFoodSelect,
		onAddClick,
		onEditClick
	}: {
		onFoodSelect: (food: FoodItem) => void;
		onAddClick: () => void;
		onEditClick: (food: FoodItem) => void;
	} = $props();

	const customFoods = $derived(foodStore.customFoods);

	let showDeleteConfirm = $state<string | null>(null);

	function handleDelete(blsCode: string) {
		showDeleteConfirm = blsCode;
	}

	function confirmDelete() {
		if (showDeleteConfirm) {
			foodStore.deleteCustomFood(showDeleteConfirm);
			showDeleteConfirm = null;
		}
	}

	function cancelDelete() {
		showDeleteConfirm = null;
	}
</script>

<div class="custom-foods">
	<div class="custom-foods__header">
		<h2 class="custom-foods__title">Eigene Lebensmittel</h2>
		<button
			onclick={onAddClick}
			data-onboarding="add-custom-food"
			class="btn btn--primary custom-foods__add-btn"
			type="button"
		>
			<span class="material-symbols-outlined">add_circle</span>
			<span class="custom-foods__add-label">Hinzufügen</span>
		</button>
	</div>

	{#if customFoods.length === 0}
		<!-- Empty state -->
		<div class="card text-center">
			<div class="custom-foods__empty">
				<span class="material-symbols-outlined icon-5xl text-muted">restaurant</span>
				<p class="custom-foods__empty-title">Noch keine eigenen Lebensmittel</p>
				<p class="custom-foods__empty-hint">
					Füge eigene Lebensmittel mit individuellen Nährwerten hinzu
				</p>
				<button
					onclick={onAddClick}
					class="btn btn--primary custom-foods__empty-btn"
					type="button"
				>
					<span class="material-symbols-outlined">add_circle</span>
					<span>Etwas hinzufügen</span>
				</button>
			</div>
		</div>
	{:else}
		<!-- Custom foods list -->
		<div class="custom-foods__list">
			{#each customFoods as food (food.blsCode)}
				<div class="card">
					<div class="custom-foods__item">
						<!-- Food info - clickable -->
						<button
							onclick={() => onFoodSelect(food)}
							class="custom-foods__item-btn"
							type="button"
						>
							<div class="custom-foods__item-info">
								<div class="custom-foods__item-name-wrap">
									<h3 class="custom-foods__item-name">
										{food.name}
									</h3>
									{#if food.subtitle}
										<p class="custom-foods__item-subtitle">
											{food.subtitle}
										</p>
									{/if}
								</div>
							</div>
							<div class="custom-foods__item-badges">
								<span class="badge badge--primary">
									{food.kh}g KH / 100{food.unit || 'gr'}
								</span>
								<span class="badge badge--secondary">
									{food.gBE}{food.unit || 'gr'} = 1 BE
								</span>
								<span class="badge badge--secondary">
									{food.gKHE}{food.unit || 'gr'} = 1 KHE
								</span>
							</div>
						</button>

						<!-- Action buttons -->
						<div class="custom-foods__item-actions">
							<button
								onclick={() => onEditClick(food)}
								class="btn btn--ghost custom-foods__action-btn custom-foods__action-btn--edit"
								aria-label="Bearbeiten"
								type="button"
							>
								<span class="material-symbols-outlined icon-xl text-primary">edit</span>
							</button>
							<button
								onclick={() => handleDelete(food.blsCode)}
								class="btn btn--ghost custom-foods__action-btn custom-foods__action-btn--delete"
								aria-label="Löschen"
								type="button"
							>
								<span class="material-symbols-outlined icon-xl text-danger">delete</span>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Info text -->
		<div class="info-box">
			<p class="custom-foods__count">
				<span class="font-medium">{customFoods.length}</span>
				{customFoods.length === 1 ? 'eigenes Lebensmittel' : 'eigene Lebensmittel'}
			</p>
		</div>
	{/if}
</div>

<!-- Delete Confirmation Dialog -->
{#if showDeleteConfirm}
	<div class="custom-foods__overlay">
		<div class="custom-foods__confirm-dialog">
			<h3 class="custom-foods__confirm-title">
				Lebensmittel löschen?
			</h3>
			<p class="custom-foods__confirm-text">
				Möchtest du dieses Lebensmittel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
			</p>
			<div class="custom-foods__confirm-actions">
				<button
					onclick={cancelDelete}
					class="btn btn--outline custom-foods__confirm-btn"
					type="button"
				>
					Abbrechen
				</button>
				<button
					onclick={confirmDelete}
					class="btn btn--danger custom-foods__confirm-btn"
					type="button"
				>
					Löschen
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-foods {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.custom-foods__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.custom-foods__title {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
	}

	.custom-foods__add-label {
		display: none;
	}

	@media (min-width: 640px) {
		.custom-foods__add-label {
			display: inline;
		}
	}

	.custom-foods__empty {
		padding-block: var(--space-xl);
	}

	.custom-foods__empty-title {
		margin-block-start: var(--space-md);
		color: var(--color-text-secondary);
	}

	.custom-foods__empty-hint {
		margin-block-start: var(--size-3xs);
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.custom-foods__empty-btn {
		margin-block-start: var(--space-md);
	}

	.custom-foods__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.custom-foods__item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-sm);
	}

	.custom-foods__item-btn {
		flex: 1;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		font: inherit;
		margin: calc(-1 * var(--space-md));
		padding: var(--space-md);
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-fast);
	}

	.custom-foods__item-btn:hover {
		background-color: var(--color-bg-inset);
	}

	.custom-foods__item-info {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-xs);
	}

	.custom-foods__item-name-wrap {
		flex: 1;
	}

	.custom-foods__item-name {
		font-weight: var(--weight-medium);
    color:var(--color-text);
	}

	.custom-foods__item-subtitle {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.custom-foods__item-badges {
		margin-block-start: var(--space-xs);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		font-size: var(--text-sm);
	}

	.custom-foods__item-actions {
		display: flex;
		gap: var(--size-3xs);
		flex-shrink: 0;
	}

	.custom-foods__action-btn--edit:hover {
		background-color: var(--color-primary-soft);
	}

	.custom-foods__action-btn--delete:hover {
		background-color: var(--color-danger-soft);
	}

	.custom-foods__count {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* Delete confirmation overlay */
	.custom-foods__overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-bg-overlay);
		padding: var(--space-md);
	}

	.custom-foods__confirm-dialog {
		width: 100%;
		max-width: 24rem;
		border-radius: var(--radius-xl);
		background-color: var(--color-bg-elevated);
		padding: var(--space-lg);
	}

	.custom-foods__confirm-title {
		margin-block-end: var(--space-md);
		font-size: var(--text-lg);
		font-weight: var(--weight-bold);
	}

	.custom-foods__confirm-text {
		margin-block-end: var(--space-lg);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.custom-foods__confirm-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.custom-foods__confirm-btn {
		flex: 1;
	}
</style>
