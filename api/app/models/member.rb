# frozen_string_literal: true

class Member < ApplicationRecord
  belongs_to :user
  belongs_to :team
  has_many :spots, inverse_of: :spotted

  validates :user, :team, presence: true

  def last_spot_image
    spots.last&.image&.attached? ? Rails.application.routes.url_helpers.url_for(spots.last.image) : "https://cloud-762p0ggyt-hack-club-bot.vercel.app/0dino.png"
  end
end
