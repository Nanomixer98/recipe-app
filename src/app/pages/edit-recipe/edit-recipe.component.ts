import { Recipe } from './../../classes/recipe';
import { RecipeService } from './../../services/recipe.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss']
})
export class EditRecipeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private recipe: Recipe;
  private instructions: FormArray;
  private ingredients: FormArray;
  public recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const recipeId = params.get('id');
        this.recipe = this.recipeService.getRecipeById(parseInt(recipeId));
        this.createForm();
      })
    );
  }

  private createForm(): void {
    this.recipeForm = this.fb.group({
      title: [this.recipe.title, [Validators.required]],
      description: [this.recipe.description, [Validators.required]],
      serves: [this.recipe.serves, [Validators.required]],
      imageUrl: [this.recipe.imageUrl, [Validators.required]],
      instructions: this.fb.array([]),
      ingredients: this.fb.array([])
    });

    this.instructions = this.recipeForm.get('instructions') as FormArray;
    this.ingredients = this.recipeForm.get('ingredients') as FormArray;

    this.recipe.instructions.forEach(instruction => {
      this.instructions.push(this.createInstruction(instruction));
    });

    this.recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.createIngredient(ingredient.amount, ingredient.name));
    });
  }

  private createInstruction(step: string): FormGroup {
    return this.fb.group({
      step: [step, [Validators.required]]
    });
  }

  private createIngredient(amount: string, name: string): FormGroup {
    return this.fb.group({
      amount: [amount, [Validators.required]],
      name: [name, [Validators.required]]
    });
  }

  addInstruction(): void {
    this.instructions.push(this.createInstruction(''));
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient('', ''));
  }

  deleteInstruction(index: number): void {
    const arrayControl = this.recipeForm.controls['instructions'] as FormArray;
    arrayControl.removeAt(index);
  }

  deleteIngredient(index: number): void {
    const arrayControl = this.recipeForm.controls['ingredients'] as FormArray;
    arrayControl.removeAt(index);
  }

  submitForm(): void {
    if (this.recipeForm.valid) {
      const {title, description, serves, imageUrl, ingredients, instructions} = this.recipeForm.value;
      const filteredInstructions = instructions.map(item => item.step);
      this.recipeService.updateRecipe(
        new Recipe(
          {
            id: this.recipe.id,
            title,
            description,
            serves,
            imageUrl,
            ingredients,
            instructions: filteredInstructions
          }
        )
      );

      this.router.navigate([`/recipes/${this.recipe.id}`]);
    } else {
      // else show an alert
      console.log("Form Error");
    }
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
