import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { DataStorageService } from '../../services/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub :Subscription;
  isAuthenticated = false;

  constructor(private dataStorage: DataStorageService, private recipeService: RecipeService, private authService: AuthService) { }

  ngOnInit(): void {
    

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  saveData(){
    
      this.dataStorage.storeRecipes()
    .subscribe();
    
    
  }

  onLogout(){
    this.authService.logout();
  }

  fetchData(){
    this.dataStorage.fetchRecipes().subscribe();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  

}
