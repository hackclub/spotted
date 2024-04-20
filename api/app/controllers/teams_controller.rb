# frozen_string_literal: true

class TeamsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_team, only: %i[show edit update destroy]

  # GET /teams
  def index
    @teams = current_user.teams.all
  end

  # GET /teams/1
  def show; end

  # GET /teams/new
  def new
    @team = current_user.teams.new
  end

  # GET /teams/1/edit
  def edit; end

  # POST /teams
  def create
    @team = current_user.teams.new(team_params)

    if @team.save
      redirect_to @team, notice: "team was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /teams/1
  def update
    if @team.update(team_params)
      redirect_to @team, notice: "team was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /teams/1
  def destroy
    @team.destroy
    redirect_to teams_url, notice: "team was successfully destroyed."
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_team
      @team = current_user.teams.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def team_params
      params.require(:team).permit(:name, :emoji, :logo)
    end
end
