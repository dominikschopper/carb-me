<script lang="ts">
	import type { FoodItem } from '$lib/types/food';
	import FoodCard from './FoodCard.svelte';
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

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Eigene Lebensmittel</h2>
		<button
			onclick={onAddClick}
			class="btn-touch bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center gap-2"
			type="button"
		>
			<span class="material-symbols-outlined leading-none text-base">add_circle</span>
			<span class="hidden sm:inline">Hinzufügen</span>
		</button>
	</div>

	{#if customFoods.length === 0}
		<!-- Empty state -->
		<div class="card text-center">
			<div class="py-8">
				<span class="material-symbols-outlined mx-auto block text-5xl text-gray-400">restaurant</span>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Noch keine eigenen Lebensmittel</p>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
					Füge eigene Lebensmittel mit individuellen Nährwerten hinzu
				</p>
				<button
					onclick={onAddClick}
					class="btn-touch mt-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
					type="button"
				>
					<span class="material-symbols-outlined leading-none mr-2">add_circle</span>
					Erstes Lebensmittel hinzufügen
				</button>
			</div>
		</div>
	{:else}
		<!-- Custom foods list -->
		<div class="space-y-2">
			{#each customFoods as food (food.blsCode)}
				<div class="card">
					<div class="flex items-start justify-between gap-3">
						<!-- Food info - clickable -->
						<button
							onclick={() => onFoodSelect(food)}
							class="flex-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 -m-4 p-4 rounded-lg transition-colors"
							type="button"
						>
							<div class="flex items-start justify-between gap-2">
								<div class="flex-1">
									<h3 class="font-medium text-gray-900 dark:text-gray-100">
										{food.name}
									</h3>
									{#if food.subtitle}
										<p class="text-sm text-gray-600 dark:text-gray-400">
											{food.subtitle}
										</p>
									{/if}
								</div>
							</div>
							<div class="mt-2 flex flex-wrap gap-2 text-sm">
								<span class="badge badge-primary">
									{food.kh}g KH / 100{food.unit || 'gr'}
								</span>
								<span class="badge badge-secondary">
									{food.gBE}{food.unit || 'gr'} = 1 BE
								</span>
								<span class="badge badge-secondary">
									{food.gKHE}{food.unit || 'gr'} = 1 KHE
								</span>
							</div>
						</button>

						<!-- Action buttons -->
						<div class="flex gap-1 shrink-0">
							<button
								onclick={() => onEditClick(food)}
								class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
								aria-label="Bearbeiten"
								type="button"
							>
								<span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">edit</span>
							</button>
							<button
								onclick={() => handleDelete(food.blsCode)}
								class="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
								aria-label="Löschen"
								type="button"
							>
								<span class="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">delete</span>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Info text -->
		<div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
			<p class="text-sm text-gray-700 dark:text-gray-300">
				<span class="font-medium">{customFoods.length}</span>
				{customFoods.length === 1 ? 'eigenes Lebensmittel' : 'eigene Lebensmittel'}
			</p>
		</div>
	{/if}
</div>

<!-- Delete Confirmation Dialog -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-800">
			<h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
				Lebensmittel löschen?
			</h3>
			<p class="mb-6 text-sm text-gray-600 dark:text-gray-400">
				Möchtest du dieses Lebensmittel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
			</p>
			<div class="flex gap-3">
				<button
					onclick={cancelDelete}
					class="btn-touch flex-1 border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					type="button"
				>
					Abbrechen
				</button>
				<button
					onclick={confirmDelete}
					class="btn-touch flex-1 bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
					type="button"
				>
					Löschen
				</button>
			</div>
		</div>
	</div>
{/if}
