# frozen_string_literal: true

Rails.application.routes.draw do
  use_doorkeeper do
    controllers applications: 'oauth_applications'
  end

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  # Administration via UI
  resources :teams
  resources :members
  resources :spots

  namespace :api do
    namespace :v1 do
      resources :teams
      resources :members
      resources :spots
      get '/me' => 'credentials#me'
    end
  end

  root to: 'home#index'
end
