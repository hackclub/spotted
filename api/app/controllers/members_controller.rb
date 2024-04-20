# frozen_string_literal: true

class MembersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_member, only: %i[show edit update destroy]

  # GET /members
  def index
    @members = current_user.members.all
  end

  # GET /members/1
  def show; end

  # GET /members/new
  def new
    @member = current_user.members.new
  end

  # GET /members/1/edit
  def edit; end

  # POST /members
  def create
    @member = current_user.members.new(member_params)

    if @member.save
      redirect_to @member, notice: "member was successfully created."
    else
      render :new
    end
  end

  # PATCH/PUT /members/1
  def update
    if @member.update(member_params)
      redirect_to @member, notice: "member was successfully updated."
    else
      render :edit
    end
  end

  # DELETE /members/1
  def destroy
    @member.destroy
    redirect_to members_url, notice: "member was successfully destroyed."
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_member
      @member = current_user.members.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def member_params
      params.require(:member).permit(:team_id)
    end
end
